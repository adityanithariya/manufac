import "@mantine/core/styles.css";
import { MantineProvider, Table } from "@mantine/core";
import { theme } from "./theme";
import dataset from "./dataset.json";

interface IData {
	Country: string;
	Year: string;
	cropName: string;
	cropProduction: number;
	yieldOfCrops: number;
	areaUnderCultivation: number;
}

export default function App() {
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
	const productionAnalytics = data.reduce(
		(
			acc: {
				[year: string]: {
					maxCrop?: string;
					minCrop?: string;
					maxProduction: number;
					minProduction: number;
				};
			},
			item,
		) => {
			const { Year, cropName, cropProduction } = item;
			if (!acc?.[Year]) {
				acc[Year] = {
					maxProduction: 0,
					minProduction: Number.MAX_VALUE,
				};
			}
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
		},
		{},
	);
	const cropAnalytics = data.reduce(
		(
			acc: {
				[crop: string]: {
					cropCount: number;
					averageYield: number;
					averageCultivationArea: number;
				};
			},
			item,
		) => {
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
				averageYield:
					(averageYield * cropCount + yieldOfCrops) / (cropCount + 1),
				averageCultivationArea:
					(averageCultivationArea * cropCount + areaUnderCultivation) /
					(cropCount + 1),
			};
			return acc;
		},
		{},
	);
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
