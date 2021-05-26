import React from "react";
import './Circle.less';

export const Circle: React.FC<{padding:boolean} | null> = ({children, padding}) => {
    return (
        <div className={"circle" + (padding ? " padding" : "")}>
            {children}
        </div>
    );
};

export default Circle;