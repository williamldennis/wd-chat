type WeatherProps = {
    temperature: number;
    weather: string;
    location: string
}

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
    return (
        <div className="border-1 bg-amber-50 border-blue-300 rounded-xl p-4 my-4">
            <h2 className="font-bold mb-1">Current Weather for {location}</h2>
            <div className="flex gap-4">
                <p className="text-sm">Condition: {weather}</p>
                <p className="text-sm">Temperature: {temperature}</p>
            </div>
        </div>
    )
}