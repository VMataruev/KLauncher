import styles from "./CustomSelect.module.css"
import { useEffect, useRef, useState } from "react";

type SelectOption = {
    id: string;
    name: string;
    icon: string;
};

type CustomSelectProps = {
    options: SelectOption[];
    value: string;
    onChange: (id: string) => void;
    placeholder?: string;
};

function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Choose option"
}: CustomSelectProps): React.JSX.Element {

    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = options.find(option => option.id === value);
    return(
        
        <>
            <div className={styles.select} ref={selectRef}>
                <button
                    type="button"
                    className={styles.selectButton}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    {selectedOption ? (
                        <div className={styles.selectedContent}>
                            <img
                                src={selectedOption.icon}
                                alt={selectedOption.name}
                                className={styles.icon}
                            />
                            {/* <span>{selectedOption.name}</span> */}
                        </div>
                    ) : (
                        <span>{placeholder}</span>
                    )}

                    <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                    <div className={styles.dropdown}>
                        {options.map(option => (
                            <button
                                key={option.id}
                                type="button"
                                className={styles.option}
                                onClick={() => {
                                    onChange(option.id);
                                    setIsOpen(false);
                                }}
                            >
                                <img
                                    src={option.icon}
                                    alt={option.name}
                                    className={styles.icon}
                                />
                                {/* <span>{option.name}</span> */}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default CustomSelect