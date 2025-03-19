import axios from 'axios';

// === Configuration ===
// WARNING: Hardcoding tokens is insecure.
// This example is for personal use and testing only.
const GITHUB_TOKEN = 'your_token_here';
const REPO_OWNER = 'UrsacheMihai';
const REPO_NAME = 'Productivity-App-V1';
const FILE_PATH = 'data.json';
const BRANCH = 'master'; // Using branch "master" per request

/**
 * Fetch the JSON file content from GitHub (base64 encoded).
 */
export const getFileContent = async (): Promise<string | null> => {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        return res.data.content; // base64 encoded
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
        return res.data.sha;
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
 * Commit and push the changes to GitHub.
 */
export const commitFileChanges = async (): Promise<void> => {
    try {
        await axios.post(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`,
            {
                message: 'Commit changes to data.json',
                tree: 'tree_sha_here', // Get the tree SHA, depends on GitHub's current commit structure
                parents: ['parent_commit_sha_here'], // Get parent commit SHA
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        // Pushing the commit
        await axios.post(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BRANCH}`,
            {
                sha: 'commit_sha_here', // After commit, use its SHA to push
            },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        console.log('Changes committed and pushed to GitHub');
    } catch (error) {
        console.error('Error committing and pushing to GitHub:', error);
    }
};

/**
 * Decode a base64 string to UTF-8.
 */
export const decodeBase64 = (base64Str: string): string => {
    return decodeURIComponent(escape(window.atob(base64Str)));
};

/**
 * Encode a UTF-8 string to base64.
 */
export const encodeBase64 = (str: string): string => {
    return window.btoa(unescape(encodeURIComponent(str)));
};
