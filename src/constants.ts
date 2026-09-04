export const NATS_SUBJECT = 'service.alert.lookup';

export const ALERT_PAYLOAD = {
  uuid: 'e78be5a4-03c5-4448-bde9-c7e78f41ffe1',
  code: 'SMF-8000-YX',
  type: 'defect',
  severity: 'major',
  description:
    'A service failed - a start, stop or refresh method failed.  Refer to SMF-8000-YX for more information.',
  response: 'The service has been placed into the maintenance state.',
  impact: 'svc:/network/nats-server:default is unavailable.',
  action:
    "Run 'svcs -xv svc:/network/nats-server:default' to determine the generic reason why the service failed, the location of any logfiles, and a list of other services impacted.",
  eventId: '0abba058-0036-4fc4-8464-104d05150946:342',
  generated: '2026-06-24T16:53:16.590Z',
  eventType: 'suspect',
} as const;

export type AlertPayload = typeof ALERT_PAYLOAD;
