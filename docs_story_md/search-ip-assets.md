# Search IP Assets

> Perform vector search for IP assets based on query text and optional media type filter. This endpoint uses AI-powered search to find relevant assets by semantic similarity.

## OpenAPI

````yaml https://api.storyapis.com/api/v4/openapi.json post /search
paths:
  path: /search
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
              mediaType:
                allOf:
                  - description: >-
                      Optional media type filter - must be 'audio', 'video', or
                      'image'. Leave empty to search all media types
                    enum:
                      - audio
                      - video
                      - image
                    examples:
                      - image
                    type: string
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationOptionsHuma'
                    description: Pagination configuration
              query:
                allOf:
                  - description: The search query string
                    examples:
                      - dragon NFT
                    maxLength: 1000
                    minLength: 1
                    type: string
            required: true
            refIdentifier: '#/components/schemas/SearchRequestBodyHuma'
            requiredProperties:
              - query
            additionalProperties: false
        examples:
          example:
            value:
              mediaType: image
              pagination:
                limit: 20
                offset: 0
              query: dragon NFT
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
                        https://api.storyapis.com/api/v4/SearchResponseBodyHuma.json
                    format: uri
                    readOnly: true
                    type: string
              data:
                allOf:
                  - description: List of IP asset search results
                    items:
                      $ref: '#/components/schemas/IPSearchResult'
                    type:
                      - array
                      - 'null'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationMetadataHuma'
                    description: Pagination information
              total:
                allOf:
                  - description: Total number of search results found
                    format: int64
                    type: integer
            refIdentifier: '#/components/schemas/SearchResponseBodyHuma'
            requiredProperties:
              - data
              - total
            additionalProperties: false
        examples:
          example:
            value:
              $schema: https://api.storyapis.com/api/v4/SearchResponseBodyHuma.json
              data:
                - description: <string>
                  ipId: <string>
                  mediaType: <string>
                  score: 123
                  similarity: 123
                  title: <string>
              pagination:
                hasMore: true
                limit: 123
                offset: 123
                total: 123
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
    IPSearchResult:
      additionalProperties: false
      properties:
        description:
          type: string
        ipId:
          type: string
        mediaType:
          type: string
        score:
          format: double
          type: number
        similarity:
          format: double
          type: number
        title:
          type: string
      required:
        - ipId
        - title
        - description
        - similarity
        - score
        - mediaType
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