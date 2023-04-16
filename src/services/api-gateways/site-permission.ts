/**
 * sample to define site permission
 * also support regex
 * You also need to ensure that an action is not exposed to both public and private route
 */

export function publicApi() {
  return ['GreeterService.sayHello', 'PersonService.a*', /^Per/];
}

export function adminApi() {
  return ['GreeterService.sayWelcome'];
}

export function openApi() {
  return ['openapi.*'];
}
