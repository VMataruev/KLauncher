import { ipcMain } from "electron";
import { spawn } from "child_process";
import path from "path";
import fs from 'fs/promises';
const { app } = require('electron');

ipcMain.handle(
    "extract-Game",
    async (ipcEvent, url: string, outputPath: string) => {
        const fileName = path.basename(new URL(url).pathname);

        const gameInstallerPath = path.join(outputPath, fileName);

        // const toolPath ="E:\\Coding\\KLauncher\\KLauncher\\resources\\tools\\innounp.exe";

        const isDev = !app.isPackaged;

        const toolPath = isDev
        ? path.join(process.cwd(), 'resources', 'tools', 'innounp.exe')
        : path.join(process.resourcesPath, 'tools', 'innounp.exe');

        // ---------------------------------------------------
        // 1. Получаем список файлов
        // ---------------------------------------------------

        const totalFiles = await new Promise<number>((resolve, reject) => {
            const infoProcess = spawn(toolPath, ["-v", gameInstallerPath], {
                cwd: outputPath,
                stdio: "pipe",
            });

            let output = "";

            infoProcess.stdout.on("data", (data) => {
                output += data.toString();
            });

            infoProcess.stderr.on("data", (data) => {
                console.error(data.toString());
            });

            infoProcess.on("close", () => {
                // Ищем строки файлов
                const lines = output.split("\n");

                const fileLines = lines.filter((line) => {
                    // строки файлов начинаются с размера
                    return /^\s*\d+\s+\d{4}-\d{2}-\d{2}/.test(line);
                });

                resolve(fileLines.length);
            });

            infoProcess.on("error", reject);
        });

        console.log("Всего файлов:", totalFiles);

        // ---------------------------------------------------
        // 2. Распаковка
        // ---------------------------------------------------

        return new Promise((resolve, reject) => {
            const child = spawn(
                toolPath,
                [
                    "-x",
                    "-y",
                    gameInstallerPath,
                ],
                {
                    cwd: outputPath,
                    stdio: "pipe",
                }
            );

            let extractedFiles = 0;
            let buffer = "";

            child.stdout.on("data", (data) => {
                buffer += data.toString();

                const lines = buffer.split(/\r?\n/);

                // последнюю неполную строку оставляем
                buffer = lines.pop() || "";

                for (const line of lines) {
                    console.log("innounp:", line);

                    // Во время extract почти каждая строка = файл
                    if (
                        line.includes("{app}") ||
                        line.includes("Extracting")
                    ) {
                        extractedFiles++;

                        const percent = Math.min(
                            100,
                            Math.floor(
                                (extractedFiles / totalFiles) * 100
                            )
                        );

                        ipcEvent.sender.send(
                            "extract-game-progress",
                            {
                                state: "extracting",
                                percent,
                                message:
                                    `Распаковка ${percent}% ` +
                                    `(${extractedFiles}/${totalFiles})`,
                                currentFile: extractedFiles,
                                totalFiles,
                                fileName,
                            }
                        );
                    }
                }
            });

            child.stderr.on("data", (data) => {
                console.error(data.toString());
            });

            child.on("close", async (code) => {
            if (code === 0) {
                try {
                    // Приводим папки в нормальный вид и удаляем ненужные

                    const oldFolderName = path.join(outputPath, "{app}");
                    const newFolderName = path.join(outputPath, "app");

                    const install_script_path = path.join(
                        outputPath,
                        "install_script.iss"
                    );

                    const autofontsPath = path.join(outputPath, "{autofonts}");
                    const tmpPath = path.join(outputPath, "{tmp}");

                    await fs.rename(oldFolderName, newFolderName);

                    await fs.rm(install_script_path, {
                        force: true,
                    });

                    await fs.rm(autofontsPath, {
                        recursive: true,
                        force: true,
                    });

                    await fs.rm(tmpPath, {
                        recursive: true,
                        force: true,
                    });

                    ipcEvent.sender.send(
                        "extract-game-progress",
                        {
                            state: "completed",
                            percent: 100,
                            message: "Распаковка завершена",
                            fileName,
                        }
                    );

                    resolve({
                        success: true,
                        path: outputPath,
                    });
                } catch (error) {
                    reject(error);
                }
            } else {
                ipcEvent.sender.send(
                    "extract-game-progress",
                    {
                        state: "failed",
                        message: `Extraction error: (${code})`,
                        fileName,
                    }
                );

                reject(
                    new Error(
                        `Extraction failed with code ${code}`
                    )
                );
            }
        });

            child.on("error", (error) => {
                reject(error);
            });
        });
    }
);