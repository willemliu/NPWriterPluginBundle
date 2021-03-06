import SkeletonComponent from './SkeletonComponent'

export default {
    name: "skeleton",
    id: 'se.infomaker.skeleton',
    configure: function (config) {

        config.addComponentToSidebarWithTabId(this.id, 'main', SkeletonComponent)

        config.addLabel('skeleton-title', {
            en: "Skeleton plugin",
            sv: "Skelettplugin"
        })
    }
}