import { getPipelineData } from './data';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': `*`,
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
}

export const handler = async (event: any) => {
    const response = await getPipelineData()
    return {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify(response),
        headers,
    }
}