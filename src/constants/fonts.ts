const fontName = {
  "Poppins-Black": "Poppins-Black",
  "Poppins-BlackItalic": "Poppins-BlackItalic",
  "Poppins-Bold": "Poppins-Bold",
  "Poppins-BoldItalic": "Poppins-BoldItalic",
  "Poppins-ExtraBold": "Poppins-ExtraBold",
  "Poppins-ExtraBoldItalic": "Poppins-ExtraBoldItalic",
  "Poppins-ExtraLight": "Poppins-ExtraLight",
  "Poppins-ExtraLightItalic": "Poppins-ExtraLightItalic",
  "Poppins-Italic": "Poppins-Italic",
  "Poppins-Light": "Poppins-Light",
  "Poppins-LightItalic": "Poppins-LightItalic",
  "Poppins-Medium": "Poppins-Medium",
  "Poppins-MediumItalic": "Poppins-MediumItalic",
  "Poppins-Regular": "Poppins-Regular",
  "Poppins-SemiBold": "Poppins-SemiBold",
  "Poppins-SemiBoldItalic": "Poppins-SemiBoldItalic",
  "Poppins-Thin": "Poppins-Thin",
  "Poppins-ThinItalic": "Poppins-ThinItalic",
} as const;

export const fonts = {
  thin: fontName["Poppins-Thin"],
  light: fontName["Poppins-Light"],
  regluar: fontName["Poppins-Regular"],
  medium: fontName["Poppins-Medium"],
  semiBold: fontName["Poppins-SemiBold"],
  bold: fontName["Poppins-Bold"],
  extraBold: fontName["Poppins-ExtraBold"],
  italic: fontName["Poppins-Italic"],
};

// whenever you your font, please update react-native.config.js
// and run command in terminal npx react-native-asset
