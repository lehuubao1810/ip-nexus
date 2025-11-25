# List Collections

> Retrieve a list of collections with pagination and filtering options. Collections can be ordered by updatedAt, assetCount, or licensesCount (asc/desc). Collections are automatically enriched with metadata. The 'where' field is optional and should only be provided when filtering by specific collection addresses or asset counts. This endpoint can also be used to fetch a single collection by passing its address in the collectionAddresses filter. Collections that don't exist in Alchemy or encounter errors will return with empty metadata instead of failing the entire request.

## OpenAPI

````yaml https://api.storyapis.com/api/v4/openapi.json post /collections
paths:
  path: /collections
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
                  - default: updatedAt
                    description: >-
                      Field to order results by: updatedAt, assetCount, or
                      licensesCount
                    enum:
                      - updatedAt
                      - assetCount
                      - licensesCount
                    type: string
              orderDirection:
                allOf:
                  - default: desc
                    description: >-
                      Order direction: asc for least recent, desc for most
                      recent
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
                  - $ref: '#/components/schemas/CollectionsWhereOptionsHuma'
                    description: Optional filter options for collections
            required: true
            refIdentifier: '#/components/schemas/CollectionsRequestBodyHuma'
            additionalProperties: false
        examples:
          example:
            value:
              orderBy: updatedAt
              orderDirection: desc
              pagination:
                limit: 20
                offset: 0
              where:
                collectionAddresses:
                  - <string>
                maxAssetCount: 1
                minAssetCount: 1
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
                        https://api.storyapis.com/api/v4/CollectionsResponseBodyHuma.json
                    format: uri
                    readOnly: true
                    type: string
              data:
                allOf:
                  - description: List of enriched collections
                    items:
                      $ref: '#/components/schemas/EnrichedCollection'
                    type:
                      - array
                      - 'null'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationMetadataHuma'
                    description: Pagination metadata
            refIdentifier: '#/components/schemas/CollectionsResponseBodyHuma'
            requiredProperties:
              - data
            additionalProperties: false
        examples:
          example:
            value:
              $schema: >-
                https://api.storyapis.com/api/v4/CollectionsResponseBodyHuma.json
              data:
                - assetCount: 123
                  cancelledDisputeCount: 123
                  collectionAddress: <string>
                  collectionMetadata:
                    address: <string>
                    chain: <string>
                    contractDeployer: <string>
                    deployedBlockNumber: 123
                    name: <string>
                    openSeaMetadata:
                      bannerImageUrl: <string>
                      collectionName: <string>
                      collectionSlug: <string>
                      description: <string>
                      discordUrl: <string>
                      externalUrl: <string>
                      floorPrice: 123
                      imageUrl: <string>
                      lastIngestedAt: '2023-11-07T05:31:56Z'
                      safelistRequestStatus: <string>
                      twitterUsername: <string>
                    symbol: <string>
                    tokenType: <string>
                    totalSupply: <string>
                  createdAt: '2023-11-07T05:31:56Z'
                  judgedDisputeCount: 123
                  licensesCount: 123
                  raisedDisputeCount: 123
                  resolvedDisputeCount: 123
                  updatedAt: '2023-11-07T05:31:56Z'
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
    CollectionsWhereOptionsHuma:
      additionalProperties: false
      properties:
        collectionAddresses:
          description: List of collection addresses to filter by (max 200)
          items:
            type: string
          maxItems: 200
          type:
            - array
            - 'null'
        maxAssetCount:
          description: Maximum asset count threshold
          format: int64
          minimum: 0
          type: integer
        minAssetCount:
          description: Minimum asset count threshold
          format: int64
          minimum: 0
          type: integer
      type: object
    ContractMetadataByAddressResponse:
      additionalProperties: false
      properties:
        address:
          type: string
        chain:
          type: string
        contractDeployer:
          type: string
        deployedBlockNumber:
          format: int64
          type: integer
        name:
          type: string
        openSeaMetadata:
          $ref: >-
            #/components/schemas/ContractMetadataByAddressResponseOpenSeaMetadataStruct
        symbol:
          type: string
        tokenType:
          type: string
        totalSupply:
          type: string
      required:
        - chain
        - address
        - name
        - symbol
        - totalSupply
        - tokenType
        - contractDeployer
        - deployedBlockNumber
        - openSeaMetadata
      type: object
    ContractMetadataByAddressResponseOpenSeaMetadataStruct:
      additionalProperties: false
      properties:
        bannerImageUrl:
          type: string
        collectionName:
          type: string
        collectionSlug:
          type: string
        description:
          type: string
        discordUrl:
          type: string
        externalUrl:
          type:
            - string
            - 'null'
        floorPrice:
          format: double
          type: number
        imageUrl:
          type: string
        lastIngestedAt:
          format: date-time
          type: string
        safelistRequestStatus:
          type: string
        twitterUsername:
          type: string
      required:
        - floorPrice
        - collectionName
        - collectionSlug
        - safelistRequestStatus
        - imageUrl
        - description
        - externalUrl
        - twitterUsername
        - discordUrl
        - bannerImageUrl
        - lastIngestedAt
      type: object
    EnrichedCollection:
      additionalProperties: false
      properties:
        assetCount:
          format: int64
          type: integer
        cancelledDisputeCount:
          format: int64
          type: integer
        collectionAddress:
          type: string
        collectionMetadata:
          $ref: '#/components/schemas/ContractMetadataByAddressResponse'
        createdAt:
          format: date-time
          type: string
        judgedDisputeCount:
          format: int64
          type: integer
        licensesCount:
          format: int64
          type: integer
        raisedDisputeCount:
          format: int64
          type: integer
        resolvedDisputeCount:
          format: int64
          type: integer
        updatedAt:
          format: date-time
          type: string
      required:
        - collectionAddress
        - assetCount
        - licensesCount
        - resolvedDisputeCount
        - cancelledDisputeCount
        - raisedDisputeCount
        - judgedDisputeCount
        - updatedAt
        - createdAt
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