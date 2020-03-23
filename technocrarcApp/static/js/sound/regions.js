export default function loadRegions(regions, wavesurfer) {
    regions.forEach(function (region) {
        region.color = 'rgba(244, 81, 30, 0.1)';
        wavesurfer.addRegion(region);
    });
}