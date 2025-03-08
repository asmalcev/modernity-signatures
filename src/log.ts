const RESET = '\x1b[0m';

const COLORS = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
};

// export const log = (...args) => console.log(...args);
export const log = (...args) => {};

export const rlog = (message) => log(`${COLORS.red}%s${RESET}`, message);
export const glog = (message) => log(`${COLORS.green}%s${RESET}`, message);
export const blog = (message) => log(`${COLORS.blue}%s${RESET}`, message);
