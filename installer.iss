[Setup]
AppName=KLauncher
AppVersion=0.0.1
DefaultDirName={pf}\KLauncher
DefaultGroupName=KLauncher
UninstallDisplayIcon={app}\KLauncher.exe
Compression=lzma2
SolidCompression=yes
OutputDir=installer
OutputBaseFilename=KLauncher-Setup
WizardStyle=modern
SetupIconFile=build\icon.ico
Uninstallable=yes

[Files]
Source: "out\klauncher-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\KLauncher"; Filename: "{app}\KLauncher.exe"
Name: "{group}\Uninstall KLauncher"; Filename: "{uninstallexe}"
Name: "{commondesktop}\KLauncher"; Filename: "{app}\KLauncher.exe"

[Run]
Filename: "{app}\KLauncher.exe"; Description: "Launch KLauncher"; Flags: postinstall nowait skipifsilent