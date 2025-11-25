# List IP Transactions

> Retrieve a list of IP transactions with pagination and filtering options. The ‘where’ field is optional and should only be provided when filtering by specific transaction hashes, event types, or block ranges. This endpoint can also be used to fetch specific transactions by passing their hashes in the txHashes filter.

## OpenAPI

````yaml https://api.storyapis.com/api/v4/openapi.json post /transactions
paths:
  path: /transactions
  method: post
  servers:
    - url: https://api.storyapis.com/api/v4
    - url: https://staging-api.storyprotocol.net/api/v4
    - url: http://localhost:8080/api/v4
      description: Local development server
  request:
    security:
      - title: ApiKeyAuth
        parameters:
          query: {}
          header:
            X-Api-Key:
              type: apiKey
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              orderBy:
                allOf:
                  - default: blockNumber
                    description: Field to order results by
                    enum:
                      - blockNumber
                      - createdAt
                      - eventType
                      - txHash
                      - ipId
                      - initiator
                    type: string
              orderDirection:
                allOf:
                  - default: desc
                    description: Order direction for results
                    enum:
                      - asc
                      - desc
                    type: string
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationOptionsHuma'
                    description: Pagination configuration
              where:
                allOf:
                  - $ref: '#/components/schemas/TransactionsWhereOptionsHuma'
                    description: Optional filter options for transactions
            required: true
            refIdentifier: '#/components/schemas/TransactionsRequestBodyHuma'
            additionalProperties: false
        examples:
          example:
            value:
              orderBy: blockNumber
              orderDirection: desc
              pagination:
                limit: 20
                offset: 0
              where:
                blockGte: 1
                blockLte: 1
                eventTypes:
                  - <string>
                initiators:
                  - <string>
                ipIds:
                  - <string>
                txHashes:
                  - <string>
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              $schema:
                allOf:
                  - description: A URL to the JSON Schema for this object.
                    examples:
                      - >-
                        https://api.storyapis.com/api/v4/TransactionsResponseBodyHuma.json
                    format: uri
                    readOnly: true
                    type: string
              data:
                allOf:
                  - description: List of IP transactions
                    items:
                      $ref: '#/components/schemas/IPTransaction'
                    type:
                      - array
                      - 'null'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationMetadataHuma'
                    description: Pagination information
            refIdentifier: '#/components/schemas/TransactionsResponseBodyHuma'
            requiredProperties:
              - data
            additionalProperties: false
        examples:
          example:
            value:
              $schema: >-
                https://api.storyapis.com/api/v4/TransactionsResponseBodyHuma.json
              data:
                - blockNumber: 123
                  createdAt: '2023-11-07T05:31:56Z'
                  eventType: <string>
                  id: 123
                  initiator: <string>
                  ipId: <string>
                  logIndex: 123
                  txHash: <string>
              pagination:
                hasMore: true
                limit: 123
                offset: 123
                total: 123
        description: OK
    default:
      application/problem+json:
        schemaArray:
          - type: object
            properties:
              $schema:
                allOf:
                  - description: A URL to the JSON Schema for this object.
                    examples:
                      - https://api.storyapis.com/api/v4/ErrorModel.json
                    format: uri
                    readOnly: true
                    type: string
              detail:
                allOf:
                  - description: >-
                      A human-readable explanation specific to this occurrence
                      of the problem.
                    examples:
                      - Property foo is required but is missing.
                    type: string
              errors:
                allOf:
                  - description: Optional list of individual error details
                    items:
                      $ref: '#/components/schemas/ErrorDetail'
                    type:
                      - array
                      - 'null'
              instance:
                allOf:
                  - description: >-
                      A URI reference that identifies the specific occurrence of
                      the problem.
                    examples:
                      - https://example.com/error-log/abc123
                    format: uri
                    type: string
              status:
                allOf:
                  - description: HTTP status code
                    examples:
                      - 400
                    format: int64
                    type: integer
              title:
                allOf:
                  - description: >-
                      A short, human-readable summary of the problem type. This
                      value should not change between occurrences of the error.
                    examples:
                      - Bad Request
                    type: string
              type:
                allOf:
                  - default: about:blank
                    description: >-
                      A URI reference to human-readable documentation for the
                      error.
                    examples:
                      - https://example.com/errors/example
                    format: uri
                    type: string
            refIdentifier: '#/components/schemas/ErrorModel'
            additionalProperties: false
        examples:
          example:
            value:
              $schema: https://api.storyapis.com/api/v4/ErrorModel.json
              detail: Property foo is required but is missing.
              errors:
                - location: <string>
                  message: <string>
                  value: <any>
              instance: https://example.com/error-log/abc123
              status: 400
              title: Bad Request
              type: https://example.com/errors/example
        description: Error
  deprecated: false
  type: path
components:
  schemas:
    ErrorDetail:
      additionalProperties: false
      properties:
        location:
          description: >-
            Where the error occurred, e.g. 'body.items[3].tags' or
            'path.thing-id'
          type: string
        message:
          description: Error message text
          type: string
        value:
          description: The value at the given location
      type: object
    IPTransaction:
      additionalProperties: false
      properties:
        blockNumber:
          format: int64
          type: integer
        createdAt:
          format: date-time
          type: string
        eventType:
          type: string
        id:
          format: int64
          type: integer
        initiator:
          type: string
        ipId:
          type: string
        logIndex:
          format: int64
          type: integer
        txHash:
          type: string
      required:
        - id
        - txHash
        - logIndex
        - blockNumber
        - eventType
        - ipId
        - initiator
        - createdAt
      type: object
    PaginationMetadataHuma:
      additionalProperties: false
      properties:
        hasMore:
          description: Whether there are more items
          type: boolean
        limit:
          description: Current limit
          format: int64
          type: integer
        offset:
          description: Current offset
          format: int64
          type: integer
        total:
          description: Total count of items
          format: int64
          type: integer
      required:
        - offset
        - limit
        - total
        - hasMore
      type: object
    PaginationOptionsHuma:
      additionalProperties: false
      properties:
        limit:
          default: 20
          description: Number of items to return
          examples:
            - 20
          format: int64
          maximum: 200
          minimum: 1
          type: integer
        offset:
          default: 0
          description: Number of items to skip
          examples:
            - 0
          format: int64
          minimum: 0
          type: integer
      type: object
    TransactionsWhereOptionsHuma:
      additionalProperties: false
      properties:
        blockGte:
          description: Filter transactions from this block number (inclusive)
          format: int64
          minimum: 0
          type: integer
        blockLte:
          description: Filter transactions up to this block number (inclusive)
          format: int64
          minimum: 0
          type: integer
        eventTypes:
          description: List of event types to filter by (max 50)
          items:
            type: string
          maxItems: 50
          type:
            - array
            - 'null'
        initiators:
          description: List of initiator addresses to filter by (max 200)
          items:
            type: string
          maxItems: 200
          type:
            - array
            - 'null'
        ipIds:
          description: List of IP asset IDs to filter by (max 200)
          items:
            type: string
          maxItems: 200
          type:
            - array
            - 'null'
        txHashes:
          description: List of transaction hashes to filter by (max 200)
          items:
            type: string
          maxItems: 200
          type:
            - array
            - 'null'
      type: object

````