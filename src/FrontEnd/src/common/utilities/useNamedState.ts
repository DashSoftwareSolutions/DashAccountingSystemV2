import {
    Dispatch,
    SetStateAction,
    useDebugValue,
    useState,
} from 'react';

export default function useNamedState<T>(name: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    useDebugValue(name, (theName: string): string => (`State '${theName}'`));
    const [state, setState] = useState<T>(initialValue);
    return [state, setState];
}
