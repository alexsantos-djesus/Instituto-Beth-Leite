import QRCode from "qrcode";
export async function generateQRDataURL(text: string) {
  return QRCode.toDataURL(text, { margin: 1, width: 512 });
}
