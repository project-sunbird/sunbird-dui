module Utils where

import Prelude
import Data.String
import Data.List (List(..), fromFoldable)
import Data.List.Types
import Data.Identity
import Data.Foreign.Index
import Data.NonEmpty (NonEmpty(..), singleton, head, tail, (:|))
import Data.Foldable
import Data.Array
import Control.Monad.Eff
import Control.Monad.Aff (launchAff, Aff, makeAff, attempt)
import Control.Monad.Eff.Exception (Error, error, try)
import Control.Monad.Eff.Class (liftEff)
import Network.HTTP.StatusCode
import Network.HTTP.RequestHeader
import Data.HTTP.Method (Method(..))
import Data.Either
import Data.Maybe
import Data.Foreign
import Data.Foreign.Class
import Data.Foreign.Generic
import Data.Foreign.Index
import Data.Argonaut.Core as A
import Data.StrMap as StrMap
import Data.Tuple
import Control.Monad.Except.Trans
import Partial.Unsafe
import Data.Bifoldable
import Control.Monad.Eff.Class(liftEff)
import Control.Monad.Aff
import Prelude
import Control.Monad.Eff (Eff,kind Effect)
import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Aff.Console
import Control.Monad.Except (runExcept, throwError)
import Control.Monad.Except.Trans (ExceptT(..))
import Data.Either (Either(..))
import Data.Foreign (Foreign, ForeignError(..), F)
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (decodeJSON, defaultOptions, encodeJSON, genericDecode, genericEncode)
import Data.Foreign.Generic.Class (class GenericDecode, class GenericEncode)
import Data.Foreign.Generic.Types (SumEncoding)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Identity (Identity(..))
import Data.List.NonEmpty (NonEmptyList(..))
import Utils

foreign import data UI :: Effect
foreign import ui' :: forall a c e. (Error -> Eff e Unit) -> (a -> Eff e Unit) -> c -> String -> Eff e Unit

class UIScreen a b where
  ui::forall e. Encode b => a -> Aff (ui::UI|e) b
  generateMockEvents :: Encode b => a -> Array b




isValidAction :: forall a e. Decode a => String -> Aff e a
isValidAction x = case (runExcept (decodeJSON x)) of
  Right y -> pure $ y
  Left err -> throwError (error (show err))

defaultDecode :: forall a b. Generic a b => GenericDecode b => Foreign -> F a
defaultDecode x = genericDecode (defaultOptions {unwrapSingleConstructors=true}) x

defaultEncode ::  forall a b. Generic a b => GenericEncode b => a -> Foreign
defaultEncode x = genericEncode (defaultOptions {unwrapSingleConstructors=true}) x



-- getEulerLocation = "https://qa.ekstep.in"
getEulerLocation = "http://52.172.36.121:9000"
getApiKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMWE2OTgxOWQ0OTc0YzhiYjRlOTQ4YjMxMjBkYjg0NyJ9.AFu4mPKLuYhclntDjbri_L5FN-rQWXk9dVXhlYO2YcA"

    
type State a = {screen :: String |a}

type AffError e = (Error -> Eff e Unit)
type AffSuccess s e = (s -> Eff e Unit)
type ApiResponse = {status :: String, statusCode :: Int, response :: A.Json}
type ExceptionableAff e a = ExceptT Error (Aff e) a
type ExceptionableEff e a = ExceptT Error (Eff e) a

foreign import showUI' :: forall e a b. (AffSuccess (State a) e) -> (AffError e) -> (State b) -> Boolean -> Eff e Unit
foreign import callbackListner' :: forall e a b. (AffSuccess ({|a}) e) -> (AffError e) -> ({|b}) -> Boolean -> Eff e Unit
foreign import sendUpdatedState' :: forall e s1 s2. (AffSuccess (State s1) e) -> (AffError e) -> (State s2) -> Boolean -> Eff e Unit
foreign import updateState' :: forall a b s1 s2 e. (AffSuccess (State s2) e) -> (AffError e) -> a -> (State s1) -> Eff e Unit
foreign import callAPI' :: forall e. (AffSuccess ApiResponse e) -> (AffError e) -> Method -> String -> A.Json -> Array RequestHeader -> Eff e Unit
foreign import getConsumerId' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit                          
foreign import getDeviceId' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit                          
foreign import getUserId' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit                          

foreign import sendToScreen' :: forall a. a -> Unit                           
sendToScreen dataToSend= sendToScreen' dataToSend



getConsumerId = ExceptT (pure <$> makeAff(\error success -> getConsumerId' success error))
getDeviceId = ExceptT (pure <$> makeAff(\error success -> getDeviceId' success error))
getUserId = ExceptT (pure <$> makeAff(\error success -> getUserId' success error))


sendUpdatedState state = makeAff(\error success -> sendUpdatedState' success error state false)
sendUpdatedStateSync state = ExceptT (pure <$> makeAff(\error success -> sendUpdatedState' success error state true))



generateReqTokenHeaders :: {consumerId :: String, deviceId :: String, userId :: String} -> Array (RequestHeader)
generateReqTokenHeaders tokens =
  let filtered = filter (\x -> not $ snd(x) == "__failed") [(Tuple "X-Consumer-Id" tokens.consumerId),
                                                            (Tuple "X-Device-Id" tokens.deviceId),
                                                            (Tuple "X-Authenticated-UserId" tokens.userId)] in
  map (\x -> (RequestHeader (fst x) (snd x))) filtered

getReqTokens :: forall e. ExceptT Error (Aff e) {consumerId :: String, deviceId :: String, userId :: String}
getReqTokens = do
  consumerId <- getConsumerId
  deviceId <- getDeviceId
  userId <- getUserId
  pure $ {consumerId, deviceId, userId}




get path headers =
  makeAff(\error success -> callAPI' success error GET ((getEulerLocation) <> path) (A.jsonEmptyObject) headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers

post path headers body =
  makeAff(\error success -> callAPI' success error POST ((getEulerLocation) <> path) body headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers


showUI screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> showUI' success error updatedState false)

genericUI :: forall a b e. Encode b => Decode b => a -> Array b -> Aff (ui::UI|e) b
genericUI a b = do
  res <- makeAff (\err sc -> (ui' err sc a (encodeJSON b)))
  isValidAction res

showUISync screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> showUI' success error updatedState true)

getCallbackFromScreen screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> callbackListner' success error updatedState false)

updateState changes state = ExceptT $ pure <$> makeAff(\error success -> updateState' success error changes state)


--API CALLS
generateRequestHeaders =
  let filtered = filter (\x -> not $ snd(x) == "__failed") [(Tuple "Authorization" ("Bearer "<>getApiKey))] in
  map (\x -> (RequestHeader (fst x) (snd x))) filtered


getDummyData =
  let requestUrl = "/v1/user/courses/user1"
      headers = (generateRequestHeaders) in
  ExceptT $ attempt $ (get requestUrl headers)

enrollCourse req=
  let requestUrl = "/v1/user/courses/enroll"
      headers = (generateRequestHeaders) in
  ExceptT $ attempt $ (post requestUrl headers req)

postExploreData req regTokens=
  let requestUrl = "/v1/page/assemble/learn.explore/org.sunbird.mobile"
      headers = (generateReqTokenHeaders regTokens) in
  ExceptT $ attempt $ (post requestUrl headers req)

getUserCourses userId =
  let requestUrl = "/v1/user/courses/" <> userId
      headers = (generateRequestHeaders) in
  ExceptT $ attempt $ (get requestUrl headers) 

getResourcePage userId =
  let requestUrl = "/v1/page/assemble/resources.explore/org.sunbird.mobile" 
      headers = (generateRequestHeaders)
      payload = A.fromObject (StrMap.fromFoldable [(Tuple "request" (A.fromObject (StrMap.fromFoldable [(Tuple "context" (A.fromObject (StrMap.fromFoldable [(Tuple "userId" (A.fromString userId))])))]) ))]) in
  ExceptT $ attempt $ ((post requestUrl headers payload))

userLogin userName userPass =
  let requestUrl = "/v1/user/login" 
      headers = (generateRequestHeaders)
      payload = A.fromObject (StrMap.fromFoldable [ (Tuple "userId" (A.fromString "unique API ID"))
                                                   , (Tuple "ts" (A.fromString "2013/10/15 16:16:3"))
                                                   , (Tuple "request" (A.fromObject (StrMap.fromFoldable  [ (Tuple "userName" (A.fromString userName))
                                                                                                          , (Tuple "password" (A.fromString userPass))
                                                                                                          , (Tuple "source" (A.fromString "web"))
                                                                                                          ])))
                                                   ]) in
  ((post requestUrl headers payload))     


 

getExceptT value = ExceptT $ pure $ Right value
