/**
 * @typedef {import('./enums').ROLES[number]} Role
 * @typedef {import('./enums').PERMISSIONS[number]} Permission
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {Role} role
 * @property {Permission[]} [permissions]
 * @property {boolean} [hasCorporateAccess]
 * @property {import('./enums').CORPORATE_MEMBER_ROLES[number]} [corporateMemberRole]
 */

/**
 * @typedef {Object} Car
 * @property {string} id
 * @property {string} make
 * @property {string} model
 * @property {string} registration
 * @property {number} year
 * @property {string} colour
 * @property {import('./enums').CAR_TYPES[number]} type
 * @property {number} seats
 * @property {import('./enums').TRANSMISSIONS[number]} transmission
 * @property {import('./enums').FUEL_TYPES[number]} fuel
 * @property {number} hourlyRate
 * @property {number} dailyRate
 * @property {number} monthlyRate
 * @property {import('./enums').CAR_OWNERSHIPS[number]} ownership
 * @property {string} [vendorId]
 * @property {number} [commissionOverride]
 * @property {import('./enums').CAR_STATUSES[number]} status
 * @property {boolean} available
 * @property {boolean} showOnSite
 * @property {string[]} featureTags
 * @property {string} imageUrl
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} carId
 * @property {string} [driverId]
 * @property {string} customerId
 * @property {string} pickupDate
 * @property {string} returnDate
 * @property {import('./enums').RENTAL_UNITS[number]} rentalUnit
 * @property {string} pickupLocation
 * @property {string} dropLocation
 * @property {boolean} withDriver
 * @property {number} total
 * @property {number} amountPaid
 * @property {import('./enums').BOOKING_STATUSES[number]} status
 */

/**
 * @typedef {Object} Driver
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {string} licenceNumber
 * @property {string} licenceExpiry
 * @property {number} experienceYears
 * @property {string} category
 * @property {string} employmentType
 * @property {string} [vendorId]
 * @property {number} hourlyCharge
 * @property {number} dailyCharge
 * @property {number} monthlyCharge
 * @property {string} status
 * @property {string} [photoUrl]
 */

/**
 * @typedef {Object} Vendor
 * @property {string} id
 * @property {string} name
 * @property {string} contactPerson
 * @property {string} phone
 * @property {string} email
 * @property {number} commissionPercent
 * @property {string} status
 */

/**
 * @typedef {Object} CorporateTrip
 * @property {string} id
 * @property {string} accountId
 * @property {string} bookedBy
 * @property {string} bookerPhone
 * @property {string} bookerEmail
 * @property {string} passenger
 * @property {string} scheduledPickup
 * @property {string} expectedCompletion
 * @property {string} [carId]
 * @property {string} [driverId]
 * @property {import('./enums').TRANSPORT_STATUSES[number]} status
 * @property {string} pickup
 * @property {string} destination
 * @property {string[]} stops
 * @property {number} [waitingTime]
 * @property {import('./enums').BILLING_ARRANGEMENTS[number]} billingArrangement
 * @property {string} [projectCode]
 * @property {string} [projectManager]
 * @property {string} [coordinator]
 * @property {string} [remarks]
 * @property {number} [serviceAmount]
 * @property {number} [taxPercent]
 * @property {string} [poNumber]
 * @property {string} [externalReference]
 */

/**
 * @typedef {Object} CorporateAccount
 * @property {string} id
 * @property {string} name
 * @property {string} contactPerson
 * @property {string} email
 * @property {string} phone
 * @property {string} status
 */

/**
 * @typedef {Object} CorporateMember
 * @property {string} id
 * @property {string} userId
 * @property {string} accountId
 * @property {import('./enums').CORPORATE_MEMBER_ROLES[number]} role
 * @property {string} status
 */

/**
 * @typedef {Object} Payment
 * @property {string} id
 * @property {string} bookingId
 * @property {number} amount
 * @property {string} method
 * @property {string} reference
 * @property {string} paidAt
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} carId
 * @property {string} customerId
 * @property {string} customerName
 * @property {number} rating
 * @property {string} comment
 * @property {string} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {boolean} active
 */

/**
 * @typedef {Object} Maintenance
 * @property {string} id
 * @property {string} carId
 * @property {string} description
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} status
 */

/**
 * @typedef {Object} Inspection
 * @property {string} id
 * @property {string} carId
 * @property {string} inspectorName
 * @property {string} inspectionDate
 * @property {string} result
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Staff
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {Permission[]} permissions
 * @property {boolean} enabled
 */

/**
 * @typedef {Object} VehicleLocation
 * @property {string} carId
 * @property {string} carName
 * @property {number} lat
 * @property {number} lng
 * @property {number} speed
 * @property {boolean} ignitionOn
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} CarMedia
 * @property {string} id
 * @property {string} carId
 * @property {string} url
 * @property {string} type
 */

/**
 * @typedef {Object} DriverMedia
 * @property {string} id
 * @property {string} driverId
 * @property {string} url
 * @property {string} type
 */

export {};
