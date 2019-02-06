#!/usr/bin/make
# Makefile readme (ru): <http://linux.yaroslavl.ru/docs/prog/gnu_make_3-79_russian_manual.html>
# Makefile readme (en): <https://www.gnu.org/software/make/manual/html_node/index.html#SEC_Contents>


.PHONY : help install test fix build build-demo dev clean clean-demo
.SILENT : help install test fix build build-demo dev
.DEFAULT_GOAL : help

# This will output the help for each task. thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	yarn install --audit

test: ## Execute tests and linters
	yarn run lint && yarn run test:unit

fix: ## Execute sources fixing
	yarn run lint:fix

clean: ## Make some clean
	rm -rf "$(shell pwd)/dist"

build: clean ## Build application bundle
	yarn run build

dev: ## Start dev server
	yarn run serve
