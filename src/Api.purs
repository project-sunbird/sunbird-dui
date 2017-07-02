module Api where

import Prelude
import Control.Monad.Aff (Aff, makeAff)
import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (log)
import Control.Monad.Eff.Exception (Error, error, throw)
import Control.Monad.Except (runExcept, throwError)
import Data.Either (Either(..))
import Data.Foreign (ForeignError(..))
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (decodeJSON, defaultOptions, encodeJSON, genericDecode, genericEncode, genericEncodeJSON)
import Data.Generic (toSignature)
import Data.Generic (class Generic) as G
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.List.NonEmpty (NonEmptyList(..))
import Data.Maybe (Maybe(..))
import Type.Proxy (Proxy(..))

data Header = Header String String
data HttpVerb = GET | POST
type StatusCode = Int

newtype Request = Request {
  url :: String,
  method :: HttpVerb,
  headers :: Array Header,
  content :: String
}

newtype Response = Response {
  status :: StatusCode,
  headers :: Array Header,
  response :: String
}

class Requestable a where
  toRequest :: Encode a => a -> Request

class Responsdable b where
  fromResponse :: forall e. Decode b => Response -> Aff e b

class ApiRequest a b where
  request :: forall e. Requestable a => Responsdable b => a -> Aff e b


getEncodedRequest :: forall a. Requestable a => Encode a => a -> String
getEncodedRequest = encodeJSON <<< toRequest

defaultPost :: {method::HttpVerb,url::String,content::String,headers::Array Header}
defaultPost = {method:POST,url:"",content:"",headers:[Header "ContentType" "application/json"]}

isValidAction :: forall a e. Decode a => String -> Aff e a
isValidAction x = case (runExcept (decodeJSON x)) of
  Right y -> pure $ y
  Left err -> throwError (error (show err))


genericFromResponse :: forall e b. Decode b => Response -> Aff e b
genericFromResponse (Response {status:s,response:r,headers:h}) = case (runExcept (decodeJSON r)) of
    Right resp -> pure $ resp
    Left err -> throwError (error $ (show err) <> "response: "<> r)

derive instance genericHeader :: Generic Header _
derive instance gHeader :: G.Generic Header
instance encodeHeader :: Encode Header where
  encode x = genericEncode (defaultOptions { unwrapSingleConstructors = true }) x
instance decodeHeader :: Decode Header where
  decode x = genericDecode (defaultOptions { unwrapSingleConstructors = true }) x

derive instance genericHttpVerb :: Generic HttpVerb _
instance encodeHttpVerb :: Encode HttpVerb where
  encode x = genericEncode (defaultOptions { unwrapSingleConstructors = true }) x

derive instance genericRequest :: Generic Request _
instance encodeRequest :: Encode Request where
  encode x = genericEncode (defaultOptions { unwrapSingleConstructors = true }) x

derive instance genericResponse :: Generic Response _
derive instance gResponse :: G.Generic Response
instance decodeResponse :: Decode Response where
  decode x = genericDecode (defaultOptions { unwrapSingleConstructors = true }) x
instance encodeResponse :: Encode Response where
  encode x = genericEncode (defaultOptions { unwrapSingleConstructors = true }) x