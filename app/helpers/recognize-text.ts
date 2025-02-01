import Tesseract, {type LoggerMessage} from "tesseract.js";

export async function analyseText(image: File, progressLogger: (m: LoggerMessage) => void): Promise<string> {
    try {
        const { data: { text } } = await Tesseract.recognize(
            image,
            "nld",
            {
                logger: progressLogger,
            }
        );
        return text.trim(); // Return extracted text
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to process the image");
    }
}
