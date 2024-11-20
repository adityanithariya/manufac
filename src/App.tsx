import "@mantine/core/styles.css";
import { MantineProvider, Table } from "@mantine/core";
import { theme } from "./theme";
import dataset from "./dataset.json";
import type { IData } from "./types";
import getProductionAnalysis from "./utils/getProductionAnalysis";
import getCropAnalysis from "./utils/getCropAnalysis";

export default function App() {
	// Data Preparation
	const data: IData[] = dataset.map((item) => {
		const {
			Country,
			Year,
			"Crop Name": cropName,
			"Crop Production (UOM:t(Tonnes))": cropProduction,
			"Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": yieldOfCrops,
			"Area Under Cultivation (UOM:Ha(Hectares))": areaUnderCultivation,
		} = item;
		return {
			Country,
			Year: Year.slice(-4),
			cropName,
			cropProduction: Number(cropProduction),
			yieldOfCrops: Number(yieldOfCrops),
			areaUnderCultivation: Number(areaUnderCultivation),
		};
	});
	// Data Analysis
	const productionAnalytics = getProductionAnalysis(data);
	const cropAnalytics = getCropAnalysis(data);
	return (
		<MantineProvider theme={theme}>
			<Table stickyHeader>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Year</Table.Th>
						<Table.Th>Crop with Maximum Production in that Year</Table.Th>
						<Table.Th>Crop with Minimum Production in that Year</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{...Object.keys(productionAnalytics).map((year) => {
						const { maxCrop, minCrop } = productionAnalytics[year];
						return (
							<Table.Tr key={year}>
								<Table.Td>{year}</Table.Td>
								<Table.Td>{maxCrop}</Table.Td>
								<Table.Td>{minCrop}</Table.Td>
							</Table.Tr>
						);
					})}
				</Table.Tbody>
			</Table>
			<Table stickyHeader>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Crop</Table.Th>
						<Table.Th>Average Yield of the Crop between 1950-2020</Table.Th>
						<Table.Th>
							Average Cultivation Area of the Crop between 1950-2020
						</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{...Object.keys(cropAnalytics).map((crop) => {
						const { averageYield, averageCultivationArea } =
							cropAnalytics[crop];
						return (
							<Table.Tr key={crop}>
								<Table.Td>{crop}</Table.Td>
								<Table.Td>{averageYield.toFixed(3)}</Table.Td>
								<Table.Td>{averageCultivationArea.toFixed(3)}</Table.Td>
							</Table.Tr>
						);
					})}
				</Table.Tbody>
			</Table>
		</MantineProvider>
	);
}
