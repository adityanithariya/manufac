export interface IData {
	Country: string;
	Year: string;
	cropName: string;
	cropProduction: number;
	yieldOfCrops: number;
	areaUnderCultivation: number;
}

export interface CropAnalysis {
	[crop: string]: {
		cropCount: number;
		averageYield: number;
		averageCultivationArea: number;
	};
}

export interface ProductionAnalysis {
	[year: string]: {
		maxCrop?: string;
		minCrop?: string;
		maxProduction: number;
		minProduction: number;
	};
}
