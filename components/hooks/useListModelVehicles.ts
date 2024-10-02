import { useState, useEffect } from "react";
import axios from "axios";

interface ModelVehicleListItem {
  id: number; // MV:id
  brandId: number; // MV:brandId
  brandName: string; // VB:name
  lineId: number; // MV:lineId
  lineName: string; // VL:name
  typeId: number; // MV:typeId
  typeName: string; // VT:name
  year: number; // MV:year
  engine: string; // MV:engine
  wheels: number; // MV:wheels
}

interface UseListModelVehiclesResult {
  data: ModelVehicleListItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useListModelVehicles = (): UseListModelVehiclesResult => {
  const [data, setData] = useState<ModelVehicleListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchModelVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ModelVehicleListItem[]>(
          "/api/vehicles/model-vehicles"
        );
        setData(response.data);
        setIsError(false);
        setError(null);
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelVehicles();
  }, []);

  return { data, isLoading, isError, error };
};
