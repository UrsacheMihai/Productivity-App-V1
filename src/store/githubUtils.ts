import axios from 'axios';

// === Configuration ===
const GITHUB_TOKEN = 'your_token_here'; // Replace with your GitHub token
const REPO_OWNER = 'UrsacheMihai'; // Replace with your GitHub username
const REPO_NAME = 'Productivity-App-V1'; // Replace with your repository name
const FILE_PATH = 'data.json';
const BRANCH = 'master'; // Branch name (can be 'main' or 'master' based on your setup)

/**
 * Fetch the JSON file content from GitHub (base64 encoded).
 */
export const getFileContent = async (): Promise<string | null> => {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        return res.data.content; // base64 encoded content
    } catch (error) {
        console.error('Error fetching file content from GitHub:', error);
        return null;
    }
};

/**
 * Fetch the current SHA of the JSON file on GitHub.
 */
export const getFileSha = async (): Promise<string | null> => {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        return res.data.sha; // SHA of the file
    } catch (error) {
        console.error('Error fetching file SHA from GitHub:', error);
        return null;
    }
};

/**
 * Update the JSON file on GitHub with the given content (base64 encoded) using the file's SHA.
 */
export const updateFileContent = async (updatedContent: string, sha: string): Promise<void> => {
    try {
        await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                message: 'Update data.json',
                content: updatedContent,
                sha: sha,
                branch: BRANCH,
            },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
    } catch (error) {
        console.error('Error updating file on GitHub:', error);
    }
};

/**
 * Encode a UTF-8 string to base64.
 */
export const encodeBase64 = (str: string): string => {
    return window.btoa(unescape(encodeURIComponent(str)));
};

/**
 * Sync local changes to GitHub: This function detects changes and pushes updates.
 */
export const syncDataToGitHub = async (localData: any): Promise<void> => {
    try {
        // Step 1: Get the current file content and SHA from GitHub
        const currentContentBase64 = await getFileContent();
        const currentSha = await getFileSha();

        if (!currentContentBase64 || !currentSha) {
            console.error('Failed to fetch file content or SHA.');
            return;
        }

        // Step 2: Decode current content and compare it to the local data
        const currentContent = decodeBase64(currentContentBase64);
        const newContentStr = JSON.stringify(localData);

        // Step 3: Check if the content has changed
        if (currentContent === newContentStr) {
            console.log('No changes detected. Skipping update.');
            return;
        }

        // Step 4: If content has changed, encode the new data and update the file on GitHub
        const encodedContent = encodeBase64(newContentStr);
        await updateFileContent(encodedContent, currentSha);

        console.log('File updated and changes pushed successfully!');
    } catch (error) {
        console.error('Error syncing data to GitHub:', error);
    }
};

/**
 * Decode a base64 string to UTF-8.
 */
export const decodeBase64 = (base64Str: string): string => {
    return decodeURIComponent(escape(window.atob(base64Str)));
};
