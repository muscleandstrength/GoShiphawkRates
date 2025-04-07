document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const packageItemsContainer = document.getElementById('packageItems');
    const addItemButton = document.getElementById('addItem');
    const quoteForm = document.getElementById('quoteForm');
    const loadingRates = document.getElementById('loadingRates');
    const noRates = document.getElementById('noRates');
    const ratesContainer = document.getElementById('ratesContainer');

    // Templates
    const packageItemTemplate = document.getElementById('packageItemTemplate');
    const rateCardTemplate = document.getElementById('rateCardTemplate');

    // API endpoint
    const API_ENDPOINT = '/api/quote';

    // Add default package item
    addPackageItem();

    // Event listeners
    addItemButton.addEventListener('click', addPackageItem);
    quoteForm.addEventListener('submit', getQuotes);

    // Function to add a new package item
    function addPackageItem() {
        const clone = document.importNode(packageItemTemplate.content, true);
        const removeButton = clone.querySelector('.remove-item');

        removeButton.addEventListener('click', function() {
            // Don't remove if it's the only item
            if (packageItemsContainer.children.length > 1) {
                this.closest('.package-item').remove();
            }
        });

        packageItemsContainer.appendChild(clone);
    }

    // Function to get quotes
    function getQuotes(event) {
        event.preventDefault();

        // Show loading indicator
        loadingRates.style.display = 'block';
        noRates.style.display = 'none';
        ratesContainer.innerHTML = '';

        // Get form values for origin address
        const originAddress = {
            name: document.getElementById('originName').value.trim(),
            company: document.getElementById('originCompany').value.trim(),
            street1: document.getElementById('originStreet1').value.trim(),
            street2: document.getElementById('originStreet2').value.trim(),
            city: document.getElementById('originCity').value.trim(),
            state: document.getElementById('originState').value.trim(),
            zip: document.getElementById('originZip').value.trim(),
            country: document.getElementById('originCountry').value.trim() || 'US',
            phone_number: document.getElementById('originPhone').value.trim()
        };

        // Get form values for destination address
        const destinationAddress = {
            name: document.getElementById('destName').value.trim(),
            company: document.getElementById('destCompany').value.trim(),
            street1: document.getElementById('destStreet1').value.trim(),
            street2: document.getElementById('destStreet2').value.trim(),
            city: document.getElementById('destCity').value.trim(),
            state: document.getElementById('destState').value.trim(),
            zip: document.getElementById('destinationZip').value.trim(),
            country: document.getElementById('destCountry').value.trim() || 'US',
            phone_number: document.getElementById('destPhone').value.trim()
        };

        // Get warehouse code
        const warehouseCode = document.getElementById('warehouseCode').value.trim();

        // Get carrier filter
        const carrierFilterSelect = document.getElementById('carrierFilter');
        const carrierFilterValue = carrierFilterSelect.value;

        // Only add carrier filter if a specific carrier is selected
        const carrierFilter = carrierFilterValue ? [carrierFilterValue] : [];

        // Validate required fields
        if (!destinationAddress.zip) {
            alert('Destination ZIP code is required');
            loadingRates.style.display = 'none';
            return;
        }

        // Get package items
        const packageItems = [];
        document.querySelectorAll('.package-item').forEach(item => {
            const packageItem = {
                name: item.querySelector('.item-name').value.trim(),
                description: item.querySelector('.item-description').value.trim(),
                sku: item.querySelector('.item-sku').value.trim(),
                weight: parseFloat(item.querySelector('.item-weight').value) || 0,
                quantity: parseInt(item.querySelector('.item-quantity').value) || 1,
                value: parseFloat(item.querySelector('.item-value').value) || 0,
                hs_code: item.querySelector('.item-hscode').value.trim(),
                country_of_origin: 'US'
            };

            // Add dimensions if provided
            const length = parseFloat(item.querySelector('.item-length').value);
            const width = parseFloat(item.querySelector('.item-width').value);
            const height = parseFloat(item.querySelector('.item-height').value);

            if (length) packageItem.length = length;
            if (width) packageItem.width = width;
            if (height) packageItem.height = height;

            // Validate required fields
            // if (!packageItem.name) {
            //     alert('Package name is required');
            //     loadingRates.style.display = 'none';
            //     return;
            // }

            if (!packageItem.weight) {
                alert('Package weight is required');
                loadingRates.style.display = 'none';
                return;
            }

            packageItems.push(packageItem);
        });

        if (packageItems.length === 0) {
            alert('At least one package item is required');
            loadingRates.style.display = 'none';
            return;
        }

        // Create request data
        const requestData = {
            items: packageItems,
            warehouse_code: warehouseCode,
            carrier_filter: carrierFilter
        };

        // Add addresses if they have required fields
        if (hasRequiredAddressFields(originAddress)) {
            requestData.origin_address = cleanEmptyAddressFields(originAddress);
        }

        if (hasRequiredAddressFields(destinationAddress)) {
            requestData.destination_address = cleanEmptyAddressFields(destinationAddress);
        }

        // For backward compatibility, also include zip codes separately
        if (originAddress.zip) {
            requestData.origin_zip = originAddress.zip;
        }

        if (destinationAddress.zip) {
            requestData.destination_zip = destinationAddress.zip;
        }

        console.log('Request data:', requestData);

        // Make API request
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to get rates');
                }
                return response.json();
            })
            .then(data => {
                displayRates(data.rates || []);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to get shipping rates. Please try again.');
            })
            .finally(() => {
                loadingRates.style.display = 'none';
            });
    }

    // Function to check if address has required fields
    function hasRequiredAddressFields(address) {
        return address.zip && (
            address.name ||
            address.street1 ||
            address.city ||
            address.state
        );
    }

    // Function to clean empty address fields
    function cleanEmptyAddressFields(address) {
        const cleaned = {};
        Object.keys(address).forEach(key => {
            if (address[key]) {
                cleaned[key] = address[key];
            }
        });
        return cleaned;
    }

    // Function to display rates
    function displayRates(rates) {
        if (!rates || rates.length === 0) {
            noRates.textContent = 'No shipping rates available for this shipment.';
            noRates.style.display = 'block';
            return;
        }

        // Sort rates by price
        rates.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

        // Clear container
        ratesContainer.innerHTML = '';

        // Add rate cards
        rates.forEach(rate => {
            const clone = document.importNode(rateCardTemplate.content, true);

            // Set rate information
            clone.querySelector('.carrier-name').textContent = rate.carrier || 'Unknown Carrier';
            clone.querySelector('.service-name').textContent = rate.service_name || rate.service_level || 'Standard Service';

            // Handle transit days
            const transitDaysElem = clone.querySelector('.transit-days');
            if (rate.service_days !== undefined) {
                transitDaysElem.textContent = `${rate.service_days} days`;
            } else {
                transitDaysElem.textContent = 'Not available';
            }

            // Handle estimated delivery
            const estDeliveryElem = clone.querySelector('.est-delivery');
            if (rate.est_delivery_date) {
                estDeliveryElem.textContent = formatDate(rate.est_delivery_date);
            } else {
                estDeliveryElem.textContent = 'Not available';
            }

            // Set price
            const totalPriceElem = clone.querySelector('.total-price');
            if (rate.price !== undefined) {
                totalPriceElem.textContent = `$${parseFloat(rate.price).toFixed(2)}`;
            } else {
                totalPriceElem.textContent = 'Price unavailable';
            }

            ratesContainer.appendChild(clone);
        });
    }

    // Function to format date
    function formatDate(dateString) {
        if (!dateString) return 'Not available';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
});