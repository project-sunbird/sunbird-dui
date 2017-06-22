module UI where

import Prelude
import Control.Monad.Aff (Aff)
import Control.Monad.Eff (kind Effect)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Except (runExcept, throwError)
import Data.Either (Either(..))
import Data.Foreign (Foreign, F)
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (decodeJSON, defaultOptions, genericDecode, genericEncode)
import Data.Foreign.Generic.Class (class GenericDecode, class GenericEncode)
import Data.Generic.Rep (class Generic)

foreign import data UI :: Effect

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