// Utility functions
export const normalizeToHourly = (value, unit) => {
    const num = Number(value)
    if (!num) return 0

    switch (unit) {
        case 'hourly':
            return num
        case 'weekly':
            return num / 40
        case 'monthly':
            return num / 173
        case 'yearly':
            return num / 2080
        default:
            return num
    }
}

export const generateSalaryText = (data) => {
    const { type, min, max, amount, unit, currency } = data

    const unitText = {
        hourly: '/hr',
        weekly: '/week',
        monthly: '/month',
        yearly: '/year',
    }[unit] || ''

    switch (type) {
        case 'range':
            return min && max ? `${min}–${max} ${currency}${unitText}` : ''
        case 'fixed':
            return amount ? `${amount} ${currency}${unitText}` : ''
        case 'starting':
            return min ? `From ${min} ${currency}${unitText}` : ''
        case 'upto':
            return max ? `Up to ${max} ${currency}${unitText}` : ''
        case 'negotiable':
            return 'Negotiable'
        default:
            return ''
    }
}

export const buildSalaryPayload = (data) => {
    const { type, min, max, amount, unit, currency } = data

    let salary = { type, unit, currency }

    // 1. Attach correct values
    if (type === 'range') {
        salary.min = Number(min) || null
        salary.max = Number(max) || null
    } else if (type === 'fixed') {
        salary.amount = Number(amount) || null
    } else if (type === 'starting') {
        salary.min = Number(min) || null
    } else if (type === 'upto') {
        salary.max = Number(max) || null
    }

    // 2. Generate display text
    salary.display_text = generateSalaryText(salary)

    // 3. Create normalized values
    let salary_min_norm = null
    let salary_max_norm = null

    if (type === 'range') {
        salary_min_norm = normalizeToHourly(min, unit)
        salary_max_norm = normalizeToHourly(max, unit)
    } else if (type === 'fixed') {
        const h = normalizeToHourly(amount, unit)
        salary_min_norm = h
        salary_max_norm = h
    } else if (type === 'starting') {
        salary_min_norm = normalizeToHourly(min, unit)
    } else if (type === 'upto') {
        salary_max_norm = normalizeToHourly(max, unit)
    }

    return {
        salary,
        salary_min_norm,
        salary_max_norm,
    }
}