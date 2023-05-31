import React, { ReactNode } from "react"
import { clsxm } from "../../common/clsxm"
import { DivProps } from "react-html-props"
import { NoiseBackground } from "../NoiseBackground";

export type CardProps = {
    children: ReactNode;
    shade: 'light' | 'medium' | 'dark';
} & DivProps

export const Card = ({ shade = 'medium', children, ...props }: CardProps) => {
    return (
        <div
            className={clsxm(
                'relative overflow-hidden p-6 backdrop-blur-2xs shadow-xl border rounded',
                'shadow-bg-950/4 dark:shadow-bg-950/20 border-bg-950 dark:border-bg-50',
                shade === 'light' && 'border-opacity-4 dark:border-opacity-8',
                shade === 'medium' && 'border-opacity-6 dark:border-opacity-6',
                shade === 'dark' && 'border-opacity-10 dark:border-opacity-4',
            )}
            {...props}
        >
            <NoiseBackground shade={shade} />
            {children}
        </div>
    )
}