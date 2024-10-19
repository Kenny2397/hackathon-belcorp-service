const {
  REGION,
  SDK_SOCKET_TIMEOUT,
  SDK_CONNECTION_TIMEOUT,
  SOCIAL_NETWORK_TABLE_NAME,
  USER_RECORD_INTERACTION,
  USER_SALES
} = process.env

export const config = {
  region: REGION,
  sdkSocketTimeout: SDK_SOCKET_TIMEOUT,
  sdkConnectionTimeout: SDK_CONNECTION_TIMEOUT,
  socialNetworkTableName: SOCIAL_NETWORK_TABLE_NAME,
  userRecordInteractionTableName: USER_RECORD_INTERACTION,
  userSalesTableName: USER_SALES
}