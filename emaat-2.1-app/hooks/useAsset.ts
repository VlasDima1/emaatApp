
import { useState, useEffect } from 'react';
import { getAsset } from '../db';

export const useAsset = (key: string | null | undefined): [string | null, boolean] => {
    const [assetData, setAssetData] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!key) {
            setAssetData(null);
            setLoading(false);
            return;
        }

        // FIX: If the key is actually a data URL (base64), use it directly.
        if (key.startsWith('data:')) {
            setAssetData(key);
            setLoading(false);
            return;
        }

        let isMounted = true;
        const fetchAsset = async () => {
            setLoading(true);
            try {
                const data = await getAsset(key);
                if (isMounted) {
                    setAssetData(data || null);
                }
            } catch (error) {
                console.error(`Failed to fetch asset with key: ${key}`, error);
                if (isMounted) {
                    setAssetData(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAsset();

        return () => {
            isMounted = false;
        };
    }, [key]);

    return [assetData, loading];
};
