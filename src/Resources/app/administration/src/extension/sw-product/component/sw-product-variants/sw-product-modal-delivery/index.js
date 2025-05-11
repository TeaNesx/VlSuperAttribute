const { Component } = Shopware;
import template from './sw-product-modal-delivery.html.twig';

Shopware.Component.override('sw-product-modal-delivery', {
    template,
    
    computed: {
        modalClasses() {
            return {
                'sw-product-modal-delivery': true,
                'variant-images-active': this.activeTab === 'variantImages'
            };
        }
    }
});
