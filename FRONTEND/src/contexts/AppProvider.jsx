import React, { useState, useEffect } from "react";

export const AppContext = React.createContext();

// https://unicode.org/emoji/charts/full-emoji-list.html
export const Emoji = ({ symbol }) => (
    <span role="img" aria-label="emoji">
        {String.fromCodePoint(symbol)}
    </span>
);
export const baseURL = "http://127.0.0.1:8000";
function AppProvider({ children }) {

    const fullLink = (link) => {
        let temp =
            link&& link.startsWith(baseURL) ? link : baseURL + link;
        return temp;
    };


    // Converts the string to a certain color
    function stringToColor(string) {
        let hash = 0;
        let i;
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Convert to HEX color value
        let color = "#";
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }


    const contextData = {
        // Data

        // Functions
        fullLink,
        stringToColor,
    };
    return (
        <AppContext.Provider value={contextData}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
