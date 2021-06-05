import React from "react";
import Paper from "@material-ui/core/Paper";

import './Box.less';

export const Box: React.FC = ({ children }) => {
    return (
        <Paper className="box" elevation={4}>
            {children}
        </Paper>
    );
};

export default Box;