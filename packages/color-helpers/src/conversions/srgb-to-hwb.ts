import type { Color } from 'types/color';
import { sRGB_to_HSL } from './srgb-to-hsl';

/**
 * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range to HWB.
 *
 * @param {Color} RGB [r, g, b]
 * - Red component 0..1
 * - Green component 0..1
 * - Blue component 0..1
 * @return {number[]} Array of HWB values
 */
export function sRGB_to_HWB(RGB: Color): Color {
	const y = sRGB_to_HSL(RGB);

	const white = Math.min(RGB[0], RGB[1], RGB[2]);
	const black = 1 - Math.max(RGB[0], RGB[1], RGB[2]);
	return ([y[0], white * 100, black * 100]);
}