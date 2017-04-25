module Main where

import Prelude
import Network.HTTP.Affjax
import Control.Monad.Except.Trans
import Partial.Unsafe
import Utils
import Control.Monad.Aff (Aff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Aff.Console (log, logShow)
import Control.Monad.Eff.Exception (Error, message)
import Data.Either (Either(..))
    
init = unsafePartial $ do
  showUI "INIT_UI" {screen:"INIT"}
   
main = unsafePartial $ launchAff $ do
  result <- runExceptT init
  case result of
    Right val -> log "ok"
    Left err -> do
      case message err of
        "401" -> log "Unauthorized"
        _ -> log "Error"
