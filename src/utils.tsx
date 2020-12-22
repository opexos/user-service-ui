/**
 * Returns local date in iso format
 */
export const getISODate = (date: Date): string => {
    return date.getFullYear()
        + "-"
        + ("0" + (date.getMonth() + 1)).slice(-2)
        + "-"
        + ("0" + date.getDate()).slice(-2);
}

export const baseAPI: string = window.location.protocol + "//" + window.location.hostname + ":8080/api";

