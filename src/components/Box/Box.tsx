import React from "react";
import './Box.less';

export const Box: React.FC = ({ children }) => {
    return (
        <div className="box">
            {children}
        </div>
    );
};

export default Box;