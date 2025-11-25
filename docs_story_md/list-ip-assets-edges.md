# List IP Asset Edges

> Retrieve a list of edges (derivative registered events) that represent relationships between IP assets. These edges show parent-child relationships formed through licensing.

## OpenAPI

````yaml https://api.storyapis.com/api/v4/openapi.json post /assets/edges
paths:
  path: /assets/edges
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
                  - description: >-
                      Field to order results by (currently only blockNumber is
                      supported)
                    enum:
                      - blockNumber
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
                  - $ref: '#/components/schemas/EdgesWhereOptionsHuma'
                    description: Filter options for edges
            required: true
            refIdentifier: '#/components/schemas/EdgesRequestBodyHuma'
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
                blockNumber: 1
                childIpId: <string>
                parentIpId: <string>
                txHash: <string>
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
                        https://api.storyapis.com/api/v4/EdgesResponseHumaBody.json
                    format: uri
                    readOnly: true
                    type: string
              data:
                allOf:
                  - description: List of derivative registered events (edges)
                    items:
                      $ref: '#/components/schemas/DerivativeRegisteredEvent'
                    type:
                      - array
                      - 'null'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationMetadataHuma'
                    description: Pagination metadata
            refIdentifier: '#/components/schemas/EdgesResponseHumaBody'
            requiredProperties:
              - data
            additionalProperties: false
        examples:
          example:
            value:
              $schema: https://api.storyapis.com/api/v4/EdgesResponseHumaBody.json
              data:
                - blockNumber: 123
                  blockTimestamp: '2023-11-07T05:31:56Z'
                  caller: <string>
                  childIpId: <string>
                  id: 123
                  licenseTemplate: <string>
                  licenseTermsId: <string>
                  licenseTokenId: <string>
                  logIndex: 123
                  parentIpId: <string>
                  processedAt: '2023-11-07T05:31:56Z'
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
    DerivativeRegisteredEvent:
      additionalProperties: false
      properties:
        blockNumber:
          format: int64
          type: integer
        blockTimestamp:
          format: date-time
          type: string
        caller:
          type: string
        childIpId:
          type: string
        id:
          format: int64
          type: integer
        licenseTemplate:
          type: string
        licenseTermsId:
          type: string
        licenseTokenId:
          type: string
        logIndex:
          format: int64
          type: integer
        parentIpId:
          type: string
        processedAt:
          format: date-time
          type: string
        txHash:
          type: string
      required:
        - id
        - blockNumber
        - blockTimestamp
        - txHash
        - logIndex
        - caller
        - childIpId
        - licenseTokenId
        - parentIpId
        - licenseTermsId
        - licenseTemplate
        - processedAt
      type: object
    EdgesWhereOptionsHuma:
      additionalProperties: false
      properties:
        blockNumber:
          description: Block number to filter by
          format: int64
          minimum: 0
          type: integer
        childIpId:
          description: Child IP ID to filter by
          pattern: ^0x[a-fA-F0-9]{40}$
          type: string
        parentIpId:
          description: Parent IP ID to filter by
          pattern: ^0x[a-fA-F0-9]{40}$
          type: string
        txHash:
          description: Transaction hash to filter by
          pattern: ^0x[a-fA-F0-9]{64}$
          type: string
      type: object
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

````