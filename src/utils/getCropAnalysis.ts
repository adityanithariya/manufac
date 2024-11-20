import type { CropAnalysis, IData } from "../types";

/**
 * Function to get crop analysis
 * @param {IData[]} data - array of data
 * @returns {CropAnalysis} cropAnalysis - object containing crop analysis
 */
const getCropAnalysis = (data: IData[]): CropAnalysis => {
	return data.reduce((acc: CropAnalysis, item) => {
		const { cropName, yieldOfCrops, areaUnderCultivation } = item;
		if (!acc?.[cropName])
			acc[cropName] = {
				cropCount: 0,
				averageYield: 0,
				averageCultivationArea: 0,
			};

		const { cropCount, averageYield, averageCultivationArea } = acc[cropName];
		acc[cropName] = {
			cropCount: cropCount + 1,
			averageYield: (averageYield * cropCount + yieldOfCrops) / (cropCount + 1),
			averageCultivationArea:
				(averageCultivationArea * cropCount + areaUnderCultivation) /
				(cropCount + 1),
		};
		return acc;
	}, {});
};

export default getCropAnalysis;
