type Nullable<T> = T | null | undefined;

const toNumber = (value: unknown): number | undefined =>
    typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const toString = (value: unknown): string | undefined =>
    typeof value === 'string' && value.length ? value : undefined;

const pickFirst = <T>(...values: Array<Nullable<T>>): T | undefined => {
    for (const value of values) {
        if (value !== null && value !== undefined) {
            return value;
        }
    }
    return undefined;
};

const pickFirstFutureHour = (hours: any[] | undefined, asOfISO?: string) => {
    if (!Array.isArray(hours) || !hours.length) return undefined;

    const asOf = asOfISO ? Date.parse(asOfISO) : Date.now();
    return hours.find(hour => {
        const start = Date.parse(hour?.forecastStart ?? '');
        return Number.isFinite(start) && start >= asOf;
    }) ?? hours[0];
};

export type WeatherAlertSummary = {
    id?: string;
    description?: string;
    severity?: string;
    urgency?: string;
    importance?: string;
    effectiveTime?: string;
    expireTime?: string;
    source?: string;
};

export type WeatherSummary = {
    location?: string;
    timezone?: string;
    reportedAt?: string;
    condition?: string;
    temperature?: number;
    apparentTemperature?: number;
    humidity?: number;
    wind?: {
        speed?: number;
        gust?: number;
        direction?: number;
    };
    precipitation?: {
        type?: string;
        conditionCode?: string;
        intensity?: number;
        amountToday?: number;
        chanceToday?: number;
    };
    temperatureRangeToday?: {
        min?: number;
        max?: number;
    };
    nextHour?: {
        forecastStart?: string;
        conditionCode?: string;
        temperature?: number;
        precipitationChance?: number;
        precipitationType?: string;
        windSpeed?: number;
        windGust?: number;
    };
    alerts?: WeatherAlertSummary[];
    source?: string;
    units?: string;
};

export function summarizeWeatherForecast(raw: any): WeatherSummary {
    if (!raw || typeof raw !== 'object') {
        return {};
    }

    const current = raw.currentWeather ?? {};
    const daily = Array.isArray(raw.forecastDaily?.days) ? raw.forecastDaily.days : [];
    const today = daily[0];
    const hourly = Array.isArray(raw.forecastHourly?.hours) ? raw.forecastHourly.hours : [];
    const nextHour = pickFirstFutureHour(hourly, current.asOf ?? raw.forecastHourly?.metadata?.readTime);

    const alerts: WeatherAlertSummary[] = Array.isArray(raw.weatherAlerts?.alerts)
        ? raw.weatherAlerts.alerts.map((alert: any) => ({
            id: toString(alert?.id),
            description: toString(alert?.description ?? alert?.phenomenon ?? alert?.token),
            severity: toString(alert?.severity),
            urgency: toString(alert?.urgency),
            importance: toString(alert?.importance),
            effectiveTime: toString(alert?.eventOnsetTime ?? alert?.effectiveTime),
            expireTime: toString(alert?.expireTime),
            source: toString(alert?.source ?? alert?.eventSource),
        }))
        : [];

    const summary: WeatherSummary = {
        location: toString(raw.location),
        timezone: toString(raw.timezone),
        reportedAt: toString(current.asOf ?? current?.metadata?.reportedTime ?? raw.forecastHourly?.metadata?.readTime),
        condition: toString(current.conditionCode),
        temperature: toNumber(current.temperature),
        apparentTemperature: toNumber(current.temperatureApparent),
        humidity: toNumber(current.humidity),
        wind: (current.windSpeed || current.windGust || current.windDirection) ? {
            speed: toNumber(current.windSpeed),
            gust: toNumber(current.windGust),
            direction: toNumber(current.windDirection),
        } : undefined,
        precipitation: (current.precipitationIntensity || today?.precipitationAmount || today?.precipitationChance) ? {
            type: toString(current.precipitationType ?? today?.precipitationType),
            conditionCode: toString(current.conditionCode ?? today?.conditionCode),
            intensity: toNumber(current.precipitationIntensity),
            amountToday: toNumber(
                pickFirst(
                    today?.precipitationAmount,
                    today?.daytimeForecast?.precipitationAmount,
                    today?.overnightForecast?.precipitationAmount,
                )
            ),
            chanceToday: toNumber(
                pickFirst(
                    today?.precipitationChance,
                    today?.daytimeForecast?.precipitationChance,
                    today?.overnightForecast?.precipitationChance,
                )
            ),
        } : undefined,
        temperatureRangeToday: (today?.temperatureMin ?? today?.temperatureMax) ? {
            min: toNumber(
                pickFirst(
                    today?.temperatureMin,
                    today?.overnightForecast?.temperatureMin,
                )
            ),
            max: toNumber(
                pickFirst(
                    today?.temperatureMax,
                    today?.daytimeForecast?.temperatureMax,
                )
            ),
        } : undefined,
        nextHour: nextHour ? {
            forecastStart: toString(nextHour.forecastStart),
            conditionCode: toString(nextHour.conditionCode),
            temperature: toNumber(nextHour.temperature),
            precipitationChance: toNumber(nextHour.precipitationChance),
            precipitationType: toString(nextHour.precipitationType),
            windSpeed: toNumber(nextHour.windSpeed),
            windGust: toNumber(nextHour.windGust),
        } : undefined,
        alerts: alerts.length ? alerts : undefined,
        source: toString(
            raw.currentWeather?.metadata?.attributionURL ??
            raw.forecastDaily?.metadata?.attributionURL ??
            raw.forecastHourly?.metadata?.attributionURL ??
            raw.weatherAlerts?.metadata?.attributionURL
        ),
        units: toString(
            raw.currentWeather?.metadata?.units ??
            raw.forecastDaily?.metadata?.units ??
            raw.forecastHourly?.metadata?.units
        ),
    };

    return summary;
}

