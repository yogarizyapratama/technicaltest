export const throwErr = (code, message) => {
    const error = new Error(message)
    error.statusCode = code
    error.status = code
    throw error
}