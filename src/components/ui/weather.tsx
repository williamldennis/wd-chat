type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <div className="my-4 rounded-xl border-1 border-blue-300 bg-amber-50 p-4">
      <h2 className="mb-1 font-bold">Current Weather for {location}</h2>
      <div className="flex gap-4">
        <p className="text-sm">Condition: {weather}</p>
        <p className="text-sm">Temperature: {temperature}</p>
      </div>
    </div>
  );
};
