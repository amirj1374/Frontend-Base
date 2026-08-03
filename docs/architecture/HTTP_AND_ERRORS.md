# HTTP and Application Errors

The consumer Axios singleton is the canonical HTTP transport. It owns API base URL, timeout, authentication headers, coordinated token refresh, and unauthenticated behavior. UI Kit DataTables receive this instance explicitly; UI Kit global Axios configuration is not the application transport.

Parallel fetch or Axios wrappers are compatibility or domain-specific paths until migrated. New infrastructure code must use the canonical transport. Domain endpoint strings and response contracts remain unchanged.

Infrastructure errors normalize to configuration, initialization, network, timeout, unauthenticated, forbidden, not-found, validation, conflict, server, and unknown categories. UI messages do not automatically expose arbitrary server payloads. A raw cause is retained only for controlled debugging.

Concurrent `401` responses must coordinate one refresh, queued requests must settle deterministically, and any request may retry authentication at most once. Unsafe mutations are not automatically retried merely because transport retry support exists.
