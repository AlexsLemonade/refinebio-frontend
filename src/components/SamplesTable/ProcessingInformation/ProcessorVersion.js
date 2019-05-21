import React from 'react';
import classnames from 'classnames';
import pick from 'lodash/pick';
import { Accordion, AccordionItem } from '../../Accordion';
import styles from './ProcessorVersion.scss';

/**
 * Returns an object with the primary versions that should be displayed in the modal
 * ref https://github.com/AlexsLemonade/refinebio-frontend/issues/65#issuecomment-401174943
 *
 * Also relevant: https://github.com/AlexsLemonade/refinebio-frontend/issues/293#issuecomment-420753323
 * Suggested that we include a field in the server to store the primary paths.
 * @param {*} processor
 */
function getPrimaryPackages(processor) {
  switch (processor.name) {
    case 'Affymetrix SCAN':
      return pick(processor.environment.R, ['SCAN.UPC', 'Brainarray']);
    case 'Salmon Quant':
      let salmonVersion = processor.environment.cmd_line['salmon --version'];
      // salmon version contains the text 'salmon', remove it
      salmonVersion = salmonVersion.replace('salmon ', '');
      return { salmon: salmonVersion };
    case 'Tximport':
      return pick(processor.environment.R, ['tximport']);
    default:
      return false;
  }
}

export default class ProcessorVersion extends React.Component {
  render() {
    const { results } = this.props;

    return (
      <React.Fragment>
        <h3 className="processing-info-modal__subtitle">Version Information</h3>
        <Accordion>
          {results.map(({ processor }) => this._renderProcessor(processor))}

          {this._renderGnomeVersion()}
        </Accordion>
      </React.Fragment>
    );
  }

  _renderProcessor(processor) {
    const primaryPackages = getPrimaryPackages(processor);
    if (!primaryPackages) return null;
    return (
      <ProcessorVersionItem
        key={processor.name}
        processor={processor}
        primaryPackages={primaryPackages}
      />
    );
  }

  _renderGnomeVersion() {
    const salmonProcessedResult = this.props.results.find(
      result => result.processor.name === 'Salmon Quant'
    );
    if (
      !salmonProcessedResult ||
      !salmonProcessedResult.organism_index ||
      !salmonProcessedResult.organism_index.assembly_name
    ) {
      return null;
    }
    return (
      <AccordionItem
        title={() => (
          <div>
            <b>Genome Build</b>

            <table>
              <tbody>
                <VersionTable
                  versions={{
                    'genome build':
                      salmonProcessedResult.organism_index.assembly_name,
                  }}
                />
              </tbody>
            </table>
          </div>
        )}
      />
    );
  }
}

function ProcessorVersionItem({ processor, primaryPackages, ...props }) {
  return (
    <AccordionItem
      {...props}
      title={() => (
        <div>
          <b>{processor.name}</b>
          <table>
            <tbody>
              <VersionTable versions={primaryPackages} />
            </tbody>
          </table>
        </div>
      )}
    >
      <div>
        <table className="version-table">
          <tbody>
            <VersionTable
              title="OS Packages"
              versions={processor.environment.os_pkg}
              className={styles.highlight}
            />
            <VersionTable
              title="Python"
              versions={processor.environment.python}
            />
            <tr
              className={classnames(
                styles.highlight,
                'version-table__group-start'
              )}
            >
              <td>
                <b>OS Distribution</b>
              </td>
              <td>{processor.environment.os_distribution}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AccordionItem>
  );
}

function VersionTable({ title, versions, className }) {
  return (
    <React.Fragment>
      <tr
        className={classnames(
          styles.tableTitle,
          'version-table__group-start',
          className
        )}
      >
        <td colSpan="2">{title}</td>
      </tr>
      {Object.keys(versions).map(version => (
        <tr className={className} key={version}>
          <td className="version-table__label">{version}</td>
          <td>{versions[version]}</td>
        </tr>
      ))}
    </React.Fragment>
  );
}
