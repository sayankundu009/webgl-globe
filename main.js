import initGlobe from './globe';
import './style.css';

function getUrlParams(url) {
    const params = {};

    try {
        const urlObj = new URL(url);

        for (const [key, value] of urlObj.searchParams.entries()) {
            params[key] = value;
        }
    } catch (error) {
        console.error("Error parsing URL:", error);
        return params;
    }

    return params;
}

let params = {};

if (window.document.currentScript) {
    const scriptUrl = window.document.currentScript.src;

    params = getUrlParams(scriptUrl);
}

const root = document.getElementById(params.containerId);

if(root){
    initGlobe(root, {
        labelTemplateId: params.labelTemplateId,
        jsonTemplateId: params.jsonTemplateId
    });
}