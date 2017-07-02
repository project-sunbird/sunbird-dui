module PureTypesApi where

import Prelude
import Api (class ApiRequest, Response(..), isValidAction, class Requestable, class Responsdable, Request(..), defaultPost, fromResponse, genericFromResponse, request)
import Control.Monad.Aff (Aff, makeAff)
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (defaultOptions, encodeJSON, genericDecode, genericEncode)
import Data.Generic (toSignature)
import Data.Generic (class Generic) as G
import Data.Generic.Rep (class Generic)
import Type.Proxy (Proxy(..))

baseUrl = "http://hpclpp-beta.ap-south-1.elasticbeanstalk.com"

newtype RequestOtp = RequestOtp {mobileNumber::String}
data RequestOtpResp = RequestOtpResp {status::String} | FailureResp {error::String,message::String}

requestOtpFlow = do
  res <- request (RequestOtp {mobileNumber:"918883141088"})
  case res of
    RequestOtpResp {status:s} -> pure $ "Verify Otp"
    FailureResp {message:msg} -> pure $ "Error " <> msg


instance requestOtp :: Requestable RequestOtp where
  toRequest x = Request defaultPost {url = baseUrl<>"/api/v1/registrationTokens",content=(encodeJSON x)}

instance requestOtpResp :: Responsdable RequestOtpResp where
  fromResponse = genericFromResponse

instance requestOtpReq :: ApiRequest RequestOtp RequestOtpResp where
  request x = genericRequestHandler x >>= fromResponse


genericRequestHandler :: forall a e. Requestable a => Encode a => a -> Aff e Response
genericRequestHandler x = (makeAff (\err sc -> sc (encodeJSON (RequestOtpResp {status:"ok"})))) >>= isValidAction

derive instance genericRequestOtp :: Generic RequestOtp _
instance encodeRequestOtp :: Encode RequestOtp where
  encode x = genericEncode (defaultOptions { unwrapSingleConstructors = true }) x

derive instance genericRequestOtpResp :: Generic RequestOtpResp _
instance encodeRequestOtpResp :: Encode RequestOtpResp where
  encode x = genericEncode (defaultOptions { unwrapSingleConstructors = true }) x
instance decodeRequestOtpResp :: Decode RequestOtpResp where
  decode x = genericDecode (defaultOptions { unwrapSingleConstructors = true }) x