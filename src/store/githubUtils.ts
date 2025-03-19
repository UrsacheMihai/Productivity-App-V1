// githubUtils.ts
import axios from 'axios';

// === Configuration ===
// WARNING: Hardcoding tokens is insecure.
// This example is for personal use and testing only.
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'UrsacheMihai';
const REPO_NAME = 'Productivity-App-V1';
const FILE_PATH = 'data.json';
const BRANCH = 'master'; // Using branch "master" per request

export const getFileContent = async (): Promise<string | null> => {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        console.log('File content fetched from GitHub:', res.data);
        return res.data.content; // base64 encoded content
    } catch (error) {
        console.error('Error fetching file content from GitHub:', error);
        return null;
    }
};

export const getFileSha = async (): Promise<string | null> => {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        console.log('File SHA:', res.data.sha);
        return res.data.sha;
    } catch (error) {
        console.error('Error fetching file SHA from GitHub:', error);
        return null;
    }
};

export const updateFileContent = async (updatedContent: string, sha: string): Promise<void> => {
    try {
        const res = await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                message: 'Update data.json',
                content: updatedContent,
                sha: sha,
                branch: BRANCH,
            },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        console.log('File update response:', res.data);
    } catch (error) {
        console.error('Error updating file on GitHub:', error);
    }
};

export const decodeBase64 = (base64Str: string): string => {
    return decodeURIComponent(escape(window.atob(base64Str)));
};

export const encodeBase64 = (str: string): string => {
    return window.btoa(unescape(encodeURIComponent(str)));
};