export function areaMapConfig() {
 const url=process.env.NEXT_PUBLIC_MAP_TILE_URL;
 const attribution=process.env.NEXT_PUBLIC_MAP_ATTRIBUTION;
 if(url&&attribution&&url.startsWith("https://"))return {url,attribution};
 if(process.env.NODE_ENV!=="production")return {url:"https://tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'};
 return null;
}
