import template from './sw-product-variants-delivery-variant-images.html.twig';
import './sw-product-variants-delivery-variant-images.scss';

Shopware.Component.register('sw-product-variants-delivery-variant-images', {
    template,

    inject: ['repositoryFactory'],

    props: {
        product: {
            type: Object,
            required: true
        },

        selectedGroups: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            isLoading: false,
            variantOptions: [],
            variants: [],
            colorGroup: null
        };
    },

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        productRepository() {
            return this.repositoryFactory.create('product');
        },
        
        variantRepository() {
            return this.repositoryFactory.create('product');
        },
        
        optionRepository() {
            return this.repositoryFactory.create('property_group_option');
        },
        
        // Get the color group from the selected groups
        colorGroupId() {
            const colorGroup = this.selectedGroups.find(group => {
                return group.name.toLowerCase().includes('farbe') || 
                       group.name.toLowerCase().includes('color');
            });
            
            return colorGroup ? colorGroup.id : null;
        },
        
        // Columns for the data grid
        variantColumns() {
            return [
                {
                    property: 'colorName',
                    label: this.$tc('vl-super-attribute.sw-product.variations.deliveryModal.variantColor'),
                    primary: true
                },
                {
                    property: 'image',
                    label: this.$tc('vl-super-attribute.sw-product.variations.deliveryModal.variantImage')
                }
            ];
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.loadVariants();
        },
        
        loadVariants() {
            this.isLoading = true;
            
            // Get all variants of the product
            const criteria = new Shopware.Data.Criteria(1, 500);
            criteria.addAssociation('options');
            criteria.addAssociation('media');
            criteria.addFilter(Shopware.Data.Criteria.equals('parentId', this.product.id));
            
            this.variantRepository.search(criteria).then((result) => {
                this.variants = result;
                
                // Process variants to display color information
                this.processVariants();
                
                this.isLoading = false;
            }).catch((error) => {
                console.error('Error loading variants:', error);
                this.isLoading = false;
            });
        },
        
        processVariants() {
            if (!this.colorGroupId) {
                // If no color group is found, just display the variants with their names
                this.variantOptions = this.variants.map(variant => {
                    return {
                        id: variant.id,
                        name: variant.name,
                        colorName: '-',
                        media: variant.media && variant.media.length > 0 ? variant.media[0] : null
                    };
                });
                return;
            }
            
            // Process variants to extract color information
            this.variantOptions = this.variants.map(variant => {
                // Find the color option for this variant
                const colorOption = variant.options.find(option => {
                    return option.groupId === this.colorGroupId;
                });
                
                return {
                    id: variant.id,
                    name: variant.name,
                    colorName: colorOption ? colorOption.name : '-',
                    colorId: colorOption ? colorOption.id : null,
                    media: variant.media && variant.media.length > 0 ? variant.media[0] : null
                };
            });
        },
        
        onMediaUpload(variant) {
            // Logic to handle media upload for a variant
            // This would be implemented to allow users to upload images for variants
        }
    }
});

