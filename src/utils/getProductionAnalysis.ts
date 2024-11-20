import type { IData, ProductionAnalysis } from "../types";

/**
 * Function to get production analysis
 * @param {IData[]} data - array of data
 * @returns {ProductionAnalysis} productionAnalysis - object containing production analysis
 */
const getProductionAnalysis = (data: IData[]): ProductionAnalysis => {
	return data.reduce((acc: ProductionAnalysis, item) => {
		const { Year, cropName, cropProduction } = item;
		if (!acc?.[Year])
			acc[Year] = {
				maxProduction: 0,
				minProduction: Number.MAX_VALUE,
			};

		if (acc?.[Year]?.maxProduction < cropProduction)
			acc[Year] = {
				...acc[Year],
				maxCrop: cropName,
				maxProduction: cropProduction,
			};
		if (acc?.[Year]?.minProduction > cropProduction)
			acc[Year] = {
				...acc[Year],
				minCrop: cropName,
				minProduction: cropProduction,
			};
		return acc;
	}, {});
};

export default getProductionAnalysis;
