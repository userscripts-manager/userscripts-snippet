/**
 * Defines the scope of a persistent parameter. This is used to determine how the parameter value is stored and shared across different pages.
 * 
 * - BY_SCRIPT: The parameter value is stored separately for each script. This means that all sites will have the same parameter value, but different scripts will have different parameter values.
 * - BY_HOST: The parameter value is stored separately for each host. This means that all pages on the same host will share the same parameter value, but different hosts will have different parameter values.
 * - BY_DOMAIN: The parameter value is stored separately for each domain. This means that all pages on the same domain (including subdomains) will share the same parameter value, but different domains will have different parameter values.
 * - BY_CUSTOM: The parameter value is stored based on a custom key. This means that the parameter value will be shared among all pages that use the same custom key, and different parameter values can be defined for different custom keys. This is useful when you want to share a parameter value across multiple scripts or across multiple hosts/domains, but you don't want to use the same parameter value for all scripts or all hosts/domains.
 */
const PERSISTENT_PARAMETER_SCOPE = {
    BY_SCRIPT: 'BY_SCRIPT',
    BY_HOST: 'BY_HOST',
    BY_DOMAIN: 'BY_DOMAIN',
    BY_CUSTOM: 'BY_CUSTOM',
}
